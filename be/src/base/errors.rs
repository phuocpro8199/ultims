use actix_web::{http::StatusCode, HttpResponse, ResponseError};
use mongodb::error::Error as MongoError;
use std::fmt;
use validator::ValidationErrors;

#[derive(Debug)]
pub enum AppError {
    Internal(String),
    BadRequest(String),
    Unauthorized(String),
    Forbidden(String),
    NotFound(String),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AppError::Internal(msg) => write!(f, "Internal error: {}", msg),
            AppError::BadRequest(msg) => write!(f, "Bad request: {}", msg),
            AppError::Unauthorized(msg) => write!(f, "Unauthorized: {}", msg),
            AppError::Forbidden(msg) => write!(f, "Forbidden: {}", msg),
            AppError::NotFound(msg) => write!(f, "Not found: {}", msg),
        }
    }
}

impl ResponseError for AppError {
    fn status_code(&self) -> StatusCode {
        match self {
            AppError::Internal(_) => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::BadRequest(_) => StatusCode::BAD_REQUEST,
            AppError::Unauthorized(_) => StatusCode::UNAUTHORIZED,
            AppError::Forbidden(_) => StatusCode::FORBIDDEN,
            AppError::NotFound(_) => StatusCode::NOT_FOUND,
        }
    }

    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code()).json(serde_json::json!({
            "error": self.to_string()
        }))
    }
}

impl From<MongoError> for AppError {
    fn from(error: MongoError) -> Self {
        AppError::Internal(error.to_string())
    }
}

impl From<bcrypt::BcryptError> for AppError {
    fn from(error: bcrypt::BcryptError) -> Self {
        AppError::Internal(error.to_string())
    }
}

impl From<jsonwebtoken::errors::Error> for AppError {
    fn from(error: jsonwebtoken::errors::Error) -> Self {
        AppError::Unauthorized(error.to_string())
    }
}

impl From<ValidationErrors> for AppError {
    fn from(error: ValidationErrors) -> Self {
        AppError::BadRequest(error.to_string())
    }
}

impl From<mongodb::bson::oid::Error> for AppError {
    fn from(error: mongodb::bson::oid::Error) -> Self {
        AppError::BadRequest(error.to_string())
    }
}

impl AppError {
    pub fn internal(msg: &str) -> Self {
        AppError::Internal(msg.to_string())
    }

    pub fn bad_request(msg: &str) -> Self {
        AppError::BadRequest(msg.to_string())
    }

    pub fn unauthorized(msg: &str) -> Self {
        AppError::Unauthorized(msg.to_string())
    }

    pub fn forbidden(msg: &str) -> Self {
        AppError::Forbidden(msg.to_string())
    }

    pub fn not_found(msg: &str) -> Self {
        AppError::NotFound(msg.to_string())
    }
}
