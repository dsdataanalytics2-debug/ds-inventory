from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional

import models
import schemas
import crud
from database import SessionLocal, engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Inventory Management API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],  # Next.js ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/add", response_model=schemas.ProductResponse)
def add_product(request: schemas.AddProductRequest, db: Session = Depends(get_db)):
    """
    Add new stock to a product
    POST /add
    """
    try:
        product = crud.add_product(db, request)
        return schemas.ProductResponse(
            success=True,
            message=f"Successfully added {request.quantity} units to {request.product_name} at ${request.unit_price} each (Total: ${request.quantity * request.unit_price})",
            product=product
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/sell", response_model=schemas.ProductResponse)
def sell_product(request: schemas.SellProductRequest, db: Session = Depends(get_db)):
    """
    Record a product sale
    POST /sell
    """
    try:
        result = crud.sell_product(db, request)
        
        # Check if result contains error
        if isinstance(result, dict) and "error" in result:
            return schemas.ProductResponse(
                success=False,
                message=result["error"],
                product=None
            )
        
        return schemas.ProductResponse(
            success=True,
            message=f"Successfully sold {request.quantity} units of {request.product_name} at ${request.unit_price} each (Total: ${request.quantity * request.unit_price})",
            product=result
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/summary")
def get_summary(start: Optional[str] = None, end: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Get overview of all products or date range summary
    GET /summary
    GET /summary?start=2025-10-01&end=2025-10-31
    """
    try:
        if start and end:
            result = crud.get_date_range_summary(db, start, end)
            return schemas.DateRangeSummaryResponse(
                products=result["products"],
                total_added_qty_in_range=result["total_added_qty_in_range"],
                total_added_amount_in_range=result["total_added_amount_in_range"],
                total_sold_qty_in_range=result["total_sold_qty_in_range"],
                total_sold_amount_in_range=result["total_sold_amount_in_range"]
            )
        else:
            products = crud.get_summary(db)
            return schemas.SummaryResponse(products=products)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/summary/enhanced", response_model=schemas.EnhancedSummaryResponse)
def get_enhanced_summary(db: Session = Depends(get_db)):
    """
    Get enhanced summary with financial analytics
    GET /summary/enhanced
    """
    try:
        enhanced_products = crud.get_enhanced_summary(db)
        return schemas.EnhancedSummaryResponse(products=enhanced_products)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    """Get all product names for dropdown selection"""
    try:
        product_names = crud.get_all_products(db)
        return {"products": product_names}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/daily-history", response_model=schemas.TransactionHistoryResponse)
def get_daily_history(start: Optional[str] = None, end: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Get individual transaction history combining add and sell records
    GET /daily-history
    GET /daily-history?start=2025-10-01&end=2025-10-31
    
    Returns individual transaction records with:
    - date: Transaction date
    - product_name: Name of the product
    - transaction_type: "add" or "sell"
    - quantity: Quantity in transaction
    - unit_price: Price per unit
    - total_amount: Total amount for transaction
    
    Results are sorted by date descending (most recent first)
    """
    try:
        transactions = crud.get_transaction_history(db, start, end)
        return schemas.TransactionHistoryResponse(transactions=transactions)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/database/view")
def view_database(db: Session = Depends(get_db)):
    """
    View all database data in a readable format
    GET /database/view
    """
    try:
        # Get all products
        products = db.query(models.Product).all()
        
        # Get all add history
        add_history = db.query(models.AddHistory).all()
        
        # Get all sell history  
        sell_history = db.query(models.SellHistory).all()
        
        return {
            "products": [
                {
                    "id": p.id,
                    "name": p.name,
                    "total_added_qty": p.total_added_qty,
                    "total_added_amount": str(p.total_added_amount),
                    "total_sold_qty": p.total_sold_qty,
                    "total_sold_amount": str(p.total_sold_amount),
                    "available_stock": p.available_stock
                } for p in products
            ],
            "add_history": [
                {
                    "id": a.id,
                    "product_id": a.product_id,
                    "product_name": db.query(models.Product).filter(models.Product.id == a.product_id).first().name,
                    "quantity": a.quantity,
                    "unit_price": str(a.unit_price),
                    "total_amount": str(a.total_amount),
                    "date": a.date
                } for a in add_history
            ],
            "sell_history": [
                {
                    "id": s.id,
                    "product_id": s.product_id,
                    "product_name": db.query(models.Product).filter(models.Product.id == s.product_id).first().name,
                    "quantity": s.quantity,
                    "unit_price": str(s.unit_price),
                    "total_amount": str(s.total_amount),
                    "date": s.date
                } for s in sell_history
            ],
            "summary": {
                "total_products": len(products),
                "total_transactions": len(add_history) + len(sell_history),
                "total_add_transactions": len(add_history),
                "total_sell_transactions": len(sell_history)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/history/add/{add_id}", response_model=schemas.DeleteResponse)
def delete_add_history(add_id: int, db: Session = Depends(get_db)):
    """
    Delete an add history record and update product totals
    DELETE /history/add/{id}
    """
    try:
        result = crud.delete_add_history(db, add_id)
        
        # Check if result contains error
        if isinstance(result, dict) and "error" in result:
            return schemas.DeleteResponse(
                success=False,
                message=result["error"],
                updated_product=None
            )
        
        return schemas.DeleteResponse(
            success=True,
            message=f"Successfully deleted add history record (ID: {add_id}). Product totals updated.",
            updated_product=result
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/history/sell/{sell_id}", response_model=schemas.DeleteResponse)
def delete_sell_history(sell_id: int, db: Session = Depends(get_db)):
    """
    Delete a sell history record and update product totals
    DELETE /history/sell/{id}
    """
    try:
        result = crud.delete_sell_history(db, sell_id)
        
        # Check if result contains error
        if isinstance(result, dict) and "error" in result:
            return schemas.DeleteResponse(
                success=False,
                message=result["error"],
                updated_product=None
            )
        
        return schemas.DeleteResponse(
            success=True,
            message=f"Successfully deleted sell history record (ID: {sell_id}). Product totals updated.",
            updated_product=result
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/")
def root():
    return {"message": "Inventory Management API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
