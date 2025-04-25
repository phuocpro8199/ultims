use crate::utils::jwt::create_jwt;
use bcrypt::{hash, verify, DEFAULT_COST};
use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use validator::Validate;
use utoipa::ToSchema;


#[derive(Debug, Serialize, Deserialize, Validate, ToSchema)]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[schema(value_type = String)]
    pub id: Option<ObjectId>,
    #[validate(email)]
    #[schema(example = "admin@yopmail.com")]
    pub email: String,
    #[schema(example = "admin@123")]
    pub password: String,
    #[schema(example = "admin")]
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize, Validate, ToSchema)]
pub struct LoginUser {
    #[validate(email)]
    #[schema(example = "admin@yopmail.com")]
    pub email: String,
    #[schema(example = "admin@123")]
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct UserResponse {
    #[schema(value_type = String)]
    pub id: String,
    pub email: String,
    pub name: String,
    pub token: String,
}

impl User {
    pub fn new(email: String, password: String, name: String) -> Self {
        User {
            id: None,
            email,
            password,
            name,
        }
    }

    pub fn hash_password(&mut self) -> Result<(), bcrypt::BcryptError> {
        let hashed = hash(&self.password, DEFAULT_COST)?;
        self.password = hashed;
        Ok(())
    }

    pub fn verify_password(&self, password: &str) -> Result<bool, bcrypt::BcryptError> {
        verify(password, &self.password)
    }

    pub fn to_response(&self, jwt_secret: &str) -> Result<UserResponse, jsonwebtoken::errors::Error> {
        let token = create_jwt(&self.id.clone().unwrap().to_hex(), jwt_secret)?;
        Ok(UserResponse {
            id: self.id.clone().unwrap().to_hex(),
            email: self.email.clone(),
            name: self.name.clone(),
            token,
        })
    }
}
