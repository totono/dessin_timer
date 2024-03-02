#[tauri::command]
pub fn read_directory(path: String) -> Result<Vec<String>, String> {
    std::fs::read_dir(path)
        .map_err(|e| e.to_string())?
        .filter_map(|entry| entry.ok())
        .filter_map(|entry| entry.path().to_str().map(String::from))
        .map(Ok) // map each String to Ok(String)
        .collect()
}

#[tauri::command]
pub fn read_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(path).map_err(|e| e.to_string())
}