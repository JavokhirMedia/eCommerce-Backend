export enum Roles {
    ADMIN = "admin",
    USER = "user",
    SUPER_ADMIN = "super_admin",
}

export enum ProductStatus {
    AVAILABLE = 'available',
    OUT_OF_STOCK = 'out_of_stock',
    DISCONTINUED = 'discontinued',
}

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export enum ResponseTypes {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    NOT_FOUND = 'not_found',
    UNAUTHORIZED = 'unauthorized',
    ADDED_TO_BASKET = 'added_to_basket',  
    ORDER_NOT_FOUND = 'order_not_found', 
    PRODUCT_NOT_FOUND = 'product_not_found', 
    FORBIDDEN = 'forbidden', 
    FETCH_ALL = 'get_all',  
    FETCH_DELETED = 'get_deleted',  
    FETCH_ONE = 'get_one',  
    ALREADY_EXISTS = 'already_exists', 
    NO_DATA = 'no_data', 
    PARENT_NOT_FOUND = 'parent_not_found',  
    CATEGORY_NOT_FOUND = 'category_not_found',  
    BASKET_ITEM_NOT_FOUND = 'basket_item_not_found', 
    BASKET_CLEARED = 'clear_basket', 
}
