from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal

class AddProductRequest(BaseModel):
    product_name: str
    quantity: int
    unit_price: Decimal
    date: str

class SellProductRequest(BaseModel):
    product_name: str
    quantity: int
    unit_price: Decimal
    date: str

class ProductBase(BaseModel):
    name: str
    total_added_qty: int
    total_added_amount: Decimal
    total_sold_qty: int
    total_sold_amount: Decimal
    available_stock: int

class Product(ProductBase):
    id: int
    
    class Config:
        from_attributes = True

class AddHistoryBase(BaseModel):
    product_id: int
    quantity: int
    unit_price: Decimal
    total_amount: Decimal
    date: str

class AddHistory(AddHistoryBase):
    id: int
    
    class Config:
        from_attributes = True

class SellHistoryBase(BaseModel):
    product_id: int
    quantity: int
    unit_price: Decimal
    total_amount: Decimal
    date: str

class SellHistory(SellHistoryBase):
    id: int
    
    class Config:
        from_attributes = True

class SummaryResponse(BaseModel):
    products: List[Product]
    
class DateRangeSummaryResponse(BaseModel):
    products: List[Product]
    total_added_qty_in_range: int
    total_added_amount_in_range: Decimal
    total_sold_qty_in_range: int
    total_sold_amount_in_range: Decimal

class ProductResponse(BaseModel):
    success: bool
    message: str
    product: Optional[Product] = None

class ProductAnalytics(ProductBase):
    id: int
    avg_purchase_price: Optional[Decimal] = None
    avg_selling_price: Optional[Decimal] = None
    profit_loss: Optional[Decimal] = None
    
    class Config:
        from_attributes = True

class EnhancedSummaryResponse(BaseModel):
    products: List[ProductAnalytics]

class DailyHistoryItem(BaseModel):
    date: str
    total_added_qty: int
    total_added_amount: Decimal
    total_sold_qty: int
    total_sold_amount: Decimal

class DailyHistoryResponse(BaseModel):
    daily_history: List[DailyHistoryItem]

class TransactionHistoryItem(BaseModel):
    id: int  # Transaction ID for deletion
    date: str
    product_name: str
    transaction_type: str  # "add" or "sell"
    quantity: int
    unit_price: Decimal
    total_amount: Decimal

class TransactionHistoryResponse(BaseModel):
    transactions: List[TransactionHistoryItem]

class DeleteResponse(BaseModel):
    success: bool
    message: str
    updated_product: Optional[Product] = None
