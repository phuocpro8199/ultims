use bson::oid::ObjectId;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use validator::Validate;
use utoipa::{IntoParams, ToSchema};

#[derive(Debug, Serialize, Deserialize, Validate, Clone, ToSchema)]
pub struct Product {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[schema(value_type = String, example = "60f1b9b3b3b3b3b3b3b3b3b3")] // Added example
    pub id: Option<ObjectId>,

    #[validate(length(min = 1))]
    #[schema(example = "Laptop")]
    pub name: String,

    #[validate(range(min = 0.0))]
    #[schema(example = 999.99)]
    pub price: f64,

    #[validate(length(min = 1))]
    #[schema(example = "A high-performance laptop")]
    pub description: String,

    #[schema(value_type = String, example = "60f1b9b3b3b3b3b3b3b3b3b4")] // Added example
    pub created_by: ObjectId, // Keep as ObjectId for DB interaction

    #[schema(value_type = String, format = "date-time")]
    pub created_at: DateTime<Utc>,

    #[schema(value_type = String, format = "date-time")]
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize, Validate, ToSchema)]
pub struct ProductInput {
    #[validate(length(min = 1))]
    #[schema(example = "Laptop Pro")]
    pub name: String,

    #[validate(range(min = 0.0))]
    #[schema(example = 1299.99)]
    pub price: f64,

    #[validate(length(min = 1))]
    #[schema(example = "An even better high-performance laptop")]
    pub description: String,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct ProductResponse {
    #[schema(example = "60f1b9b3b3b3b3b3b3b3b3b3")]
    pub id: String,
    #[schema(example = "Laptop")]
    pub name: String,
    #[schema(example = 999.99)]
    pub price: f64,
    #[schema(example = "A high-performance laptop")]
    pub description: String,
}

impl Product {
    pub fn to_response(&self) -> ProductResponse {
        ProductResponse {
            id: self.id.expect("Product ID should exist when converting to response").to_hex(),
            name: self.name.clone(),
            price: self.price,
            description: self.description.clone(),
        }
    }
}


#[derive(Debug, Deserialize, Serialize, Validate, ToSchema, IntoParams)]
pub struct ProductQueryInput {
    #[schema(example = "Laptop Pro", nullable = true)]
    #[validate(length(min = 1, message = "Product name must be at least 1 character"))]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    #[schema(example = 1, nullable = true, default = 1)]
    #[validate(range(min = 1, message = "Page number must be at least 1"))]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub page: Option<i64>,

    #[schema(example = 10, nullable = true, default = 10)]
    #[validate(range(min = 1, message = "Limit must be at least 1"))]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<i64>,
}
