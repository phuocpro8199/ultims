use mongodb::{Client, options::ClientOptions};
use std::env;

pub async fn _get_db_client() -> Result<Client, mongodb::error::Error> {
    let mongodb_uri = env::var("MONGODB_URI").unwrap_or_else(|_| "mongodb://localhost:27017".to_string());
    
    let client_options = ClientOptions::parse(mongodb_uri).await?;
    
    Client::with_options(client_options)
}

pub fn get_collection<T: std::marker::Send + std::marker::Sync>(client: &Client, name: &str) -> mongodb::Collection<T> {
    client.database("rust").collection(name)
}
