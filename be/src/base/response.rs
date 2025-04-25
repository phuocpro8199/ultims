use utoipa::ToSchema;
use serde::Serialize;

#[derive(Debug, Serialize, ToSchema)]
pub struct ApiResponse<T: Serialize + ToSchema + Send + Sync> {
    #[schema(example = "success")]
    pub status: String,
    #[schema(example = "Operation completed successfully")]
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<T>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub page: Option<u32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub limit: Option<u32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub total: Option<u32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub total_pages: Option<u32>,
}

impl<T: Serialize + ToSchema + Send + Sync> Default for ApiResponse<T> {
    fn default() -> Self {
        ApiResponse {
            status: "success".to_string(),
            message: "Operation completed successfully".to_string(),
            data: None,
            page: None,
            limit: None,
            total: None,
            total_pages: None,
        }
    }
}
