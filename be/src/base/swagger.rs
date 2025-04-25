use utoipa::OpenApi;
use crate::models::{user::{User, LoginUser, UserResponse}, product::{Product, ProductResponse}};
use crate::handlers::{auth, product};

#[derive(OpenApi)]
#[openapi(
    paths(
        auth::register,
        auth::login,
        product::create_product,
        product::get_products,
        product::get_product,
        product::update_product,
        product::delete_product,
    ),
    components(
        schemas(User, LoginUser, UserResponse, Product, ProductResponse)
    ),
    tags(
        (name = "Authentication", description = "User authentication endpoints"),
        (name = "Products", description = "Product management endpoints")
    )
)]
pub struct ApiDoc;

impl ApiDoc {
    pub fn new() -> utoipa::openapi::OpenApi {
        ApiDoc::openapi()
    }
}
