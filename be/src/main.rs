use actix_cors::Cors;
use actix_web::{http::header, middleware::Logger, web, App, HttpServer};
use dotenv::dotenv;
use mongodb::Client;
use std::env;
use utoipa_swagger_ui::SwaggerUi;

mod base;
mod handlers;
mod utils;
mod models;

use crate::base::swagger::ApiDoc;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let mongodb_uri = env::var("MONGODB_URI").expect("MONGODB_URI must be set");
    let client = Client::with_uri_str(&mongodb_uri)
        .await
        .expect("Failed to connect to MongoDB");

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_origin("http://localhost:3001")
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
            .allowed_headers(vec![
                header::CONTENT_TYPE,
                header::AUTHORIZATION,
                header::ACCEPT,
            ])
            .supports_credentials();

        App::new()
            .app_data(web::Data::new(client.clone()))
            .wrap(cors)
            .wrap(Logger::default())
            // --- API Routes ---
            .service(
                web::scope("/api") // Group API routes under /api
                    .configure(handlers::auth::config) // Use handlers directly
                    .configure(handlers::product::config) // Use handlers directly
            )
            // --- Swagger UI ---
            .service(
                SwaggerUi::new("/api-docs/{_:.*}")
                    .url("/api-docs/openapi.json", ApiDoc::new()),
            )
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}

