from sqlalchemy import Column, Integer, String, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from database import Base

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    total_added_qty = Column(Integer, default=0)
    total_added_amount = Column(Numeric(10, 2), default=0.00)
    total_sold_qty = Column(Integer, default=0)
    total_sold_amount = Column(Numeric(10, 2), default=0.00)
    available_stock = Column(Integer, default=0)
    
    add_histories = relationship("AddHistory", back_populates="product")
    sell_histories = relationship("SellHistory", back_populates="product")

class AddHistory(Base):
    __tablename__ = "add_history"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    unit_price = Column(Numeric(10, 2))
    total_amount = Column(Numeric(10, 2))
    date = Column(String)
    
    product = relationship("Product", back_populates="add_histories")

class SellHistory(Base):
    __tablename__ = "sell_history"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    unit_price = Column(Numeric(10, 2))
    total_amount = Column(Numeric(10, 2))
    date = Column(String)
    
    product = relationship("Product", back_populates="sell_histories")
