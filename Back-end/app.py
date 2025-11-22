from fastapi import FastAPI, HTTPException, Request
import logging
from fastapi.middleware.cors import CORSMiddleware
from flask import jsonify
from pydantic import BaseModel
from Queries.Users.Register import register_user
from Queries.Users.FetchUser import fetch_users
from Queries.Users.Login import login_user
from Queries.Users.EditUser import edit_user_query
from Queries.Users.UpdateProfile import update_profile
from Queries.Users.ChangePassword import change_user_password
from Queries.Office.AddOffice import add_office
from Queries.Office.FetchOffice import fetch_offices
from Queries.Office.EditOffice import edit_office_query
from pydantic import BaseModel
from Queries.Category.AddCategory import add_category
from Queries.Category.FetchCategory import fetch_categories
from Queries.Category.EditCategory import edit_category_query
from Queries.Supplier.AddSupplier import add_supplier
from Queries.Supplier.FetchSupplier import fetch_suppliers
from Queries.Supplier.EditSupplier import edit_supplier
from Queries.Category.GetCategoryList import get_category_list
from Queries.Item.AddItem import add_item
from Queries.Item.FetchItem import fetch_items
from Queries.Item.UpdateItem import edit_item_query
from Queries.Item.DeleteItem import update_item_status
from Queries.RIS.GetItemList import get_item_list
from Queries.RIS.AddRIS import add_ris_transaction
from Queries.RIS.FetchRIS import fetch_ris_data
from Queries.RIS.fetch_ris_items import fetch_ris_items
from Queries.RIS.FetchRISAggregated import fetch_aggregated_ris_items
from Queries.RIS.Approve_ris import add_purchase_order_query
from Queries.RIS.Direct_Approve import approve_ris_item_query
from Queries.Delivery.FetchDelivery import fetch_delivery_data
from Queries.Delivery.SaveDelivery import mark_as_delivered
from Queries.RIS.ReceivePurchaseItem import receive_item_query
from Queries.RIS.UpdateRISStatus import update_ris_status
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserUpdate(BaseModel):
    fname: str
    mname: str | None = None
    lname: str
    extensionName: str | None = None
    birthdate: str
    email: str
    office: str
    role: str
    status: str


@app.put("/edit_user/{user_id}")
def edit_user(user_id: int, user: UserUpdate):
    result = edit_user_query(user_id, user.dict())
    if result["status"] == "error":
        raise HTTPException(status_code=404, detail=result["message"])
    return result


@app.get("/users")
def users_route():
    return fetch_users()


@app.post("/register")
def register_route(user: dict):
    return register_user(user)

@app.post("/login")
def login_route(user: dict):
    return login_user(user)

@app.put("/profile/{user_id}")
def update_profile_route(user_id: int, body: dict):
    try:
        success = update_profile(user_id, body)
        if success:
            return {"success": True, "message": "Profile updated successfully"}
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
class PasswordUpdate(BaseModel):
    user_id: int
    new_password: str

@app.put("/user/change-password")
def change_password(data: PasswordUpdate):
    try:
        change_user_password(data.user_id, data.new_password)
        return {"message": "Password updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/office/add")
def add_office_route(office: dict):
    result = add_office(office)
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@app.get("/office/list")
def list_offices():
    try:
        offices = fetch_offices()
        return {"status": "success", "data": offices}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class OfficeUpdate(BaseModel):
    officeName: str
    location: str
    status: str
@app.put("/office/edit/{office_id}")
def edit_office_route(office_id: int, office: OfficeUpdate):
    result = edit_office_query(office_id, office.dict())
    if result["status"] == "error":
        raise HTTPException(status_code=404, detail=result["message"])
    return result

@app.post("/category/add")
def add_category_route(category: dict):
    result = add_category(category)
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@app.get("/category/list")
def list_categories():
    result = fetch_categories()
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    return result

class CategoryUpdate(BaseModel):
    categoryName: str
    description: str
    status: str

@app.put("/category/edit/{category_id}")
def edit_category_route(category_id: int, category: CategoryUpdate):
    result = edit_category_query(category_id, category.dict())
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@app.post("/supplier/add")
def add_supplier_route(supplier: dict):
    result = add_supplier(supplier)
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@app.get("/supplier/fetch")
def get_suppliers():
    return fetch_suppliers()

class SupplierUpdate(BaseModel):
    supplier: str
    address: str
    contactNumber: str
    status: str

@app.put("/supplier/edit/{supplier_id}")
def edit_supplier_route(supplier_id: int, supplier: SupplierUpdate):
    result = edit_supplier(supplier_id, supplier.dict())
    if result["status"] == "error":
        raise HTTPException(status_code=404, detail=result["message"])
    return result

@app.get("/category/select-list")
def get_category_list_route():
    """
    Returns category list formatted for dropdown (React Select)
    """
    result = get_category_list()
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@app.post("/item/add")
def add_item_route(item: dict):
    result = add_item(item)
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@app.get("/ris/list")
def list_ris():
    try:
        result = fetch_ris_data()
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ItemUpdate(BaseModel):
    productName: str
    description: str
    categoryName: str
    unitPrice: float
    stockQty: int

@app.put("/item/update/{item_id}")
def update_item(item_id: int, item: ItemUpdate):
    result = edit_item_query(item_id, item.dict())
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@app.put("/item/status/{item_id}")
def update_item_status_route(item_id: int):
    result = update_item_status(item_id)
    if result["status"] == "error":
        raise HTTPException(status_code=404, detail=result["message"])
    return result

@app.get("/item/select-list")
def item_select_list():
    """
    Returns items formatted for dropdown (React Select)
    """
    result = get_item_list()
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@app.post("/ris/add")
def add_ris_route(ris: dict):
    result = add_ris_transaction(ris)
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@app.get("/item/list")
def list_items():
    try:
        result = fetch_items()
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ris/list")
def list_ris():
    try:
        result = fetch_ris_data()
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ris/items/{ris_id}")
def get_ris_items(ris_id: int):
    result = fetch_ris_items(ris_id)
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    return result


@app.get("/ris/aggregated-items")
def ris_aggregated_items():
    result = fetch_aggregated_ris_items()
    if result.get("status") == "error":
        raise HTTPException(status_code=500, detail=result.get("message"))
    return result

class PurchaseOrderRequest(BaseModel):
    SupplierId: int
    RID_details_id: int
    QtyToOrder: int
    id: int

@app.post("/purchase_order/add")
def add_purchase_order(data: PurchaseOrderRequest):
    return add_purchase_order_query(
        data.SupplierId, data.RID_details_id, data.QtyToOrder, data.id
    )
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@app.post("/ris/approve")
def approve_ris_item(data: dict):
    result = approve_ris_item_query(data["RID_details_id"], data["user_id"])
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@app.get("/delivery/list")
def get_delivery():
    result = fetch_delivery_data()
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@app.put("/delivery/mark-delivered/{purchase_id}")
def mark_delivered(purchase_id: int):
    """Mark a purchase order as delivered and update StockCard"""
    result = mark_as_delivered(purchase_id)
    if result["status"] != "success":
        raise HTTPException(status_code=500, detail=result["message"])
    return {"status": "success", "message": result["message"]}

class ReceiveItemBody(BaseModel):
    RID_details_id: int
    user_id: int  # for tracking, if needed

@app.post("/ris/receive")
def receive_ris_item(body: ReceiveItemBody):
    result = receive_item_query(body.RID_details_id)

    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])

    return result

class CompleteRISBody(BaseModel):
    ris_id: int

@app.put("/ris/complete")
def complete_ris(body: CompleteRISBody):
    try:
        result = update_ris_status(body.ris_id, "Completed")
        if result["status"] != "success":
            raise HTTPException(status_code=400, detail=result["message"])
        return {"status": "success", "message": "RIS marked as Completed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))