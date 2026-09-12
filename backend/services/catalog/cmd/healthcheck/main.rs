fn main() {
    let port = std::env::var("HEALTHCHECK_PORT").unwrap_or_else(|_| "8081".into());
    let addr = format!("localhost:{port}");

    match std::net::TcpStream::connect(&addr) {
        Ok(mut stream) => {
            use std::io::{Read, Write};
            let _ = stream.write_all(b"GET /healthz HTTP/1.0\r\nHost: localhost\r\n\r\n");
            let mut buf = [0u8; 128];
            match stream.read(&mut buf) {
                Ok(n) if n > 0 => {
                    let head = String::from_utf8_lossy(&buf[..n]);
                    if head.contains(" 200") {
                        std::process::exit(0);
                    }
                    eprintln!("unexpected response: {head}");
                    std::process::exit(1);
                }
                Ok(_) => std::process::exit(0),
                Err(e) => {
                    eprintln!("read failed: {e}");
                    std::process::exit(1);
                }
            }
        }
        Err(e) => {
            eprintln!("dial failed: {e}");
            std::process::exit(1);
        }
    }
}
