// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod commands;
use commands::{read_directory, read_file};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![read_directory, read_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
