use bson::oid::ObjectId;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

// Custom wrapper types for schema generation
#[derive(Serialize, Deserialize, ToSchema)]
pub struct ObjectIdWrapper(String);

#[derive(Serialize, Deserialize, ToSchema)]
pub struct DateTimeWrapper(String);

// Implement conversion methods if needed
impl From<ObjectId> for ObjectIdWrapper {
    fn from(oid: ObjectId) -> Self {
        ObjectIdWrapper(oid.to_string())
    }
}

impl From<DateTime<Utc>> for DateTimeWrapper {
    fn from(dt: DateTime<Utc>) -> Self {
        DateTimeWrapper(dt.to_rfc3339())
    }
}
