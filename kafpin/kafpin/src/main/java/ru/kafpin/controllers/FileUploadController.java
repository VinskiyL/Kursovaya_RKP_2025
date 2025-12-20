package ru.kafpin.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @PostMapping("/cover")
    public ResponseEntity<?> uploadCover(@RequestParam("file") MultipartFile file) {
        try {
            // Проверяем тип файла
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Файл пустой");
            }

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Разрешены только изображения");
            }

            // Создаем директорию если не существует
            Path uploadPath = Paths.get(uploadDir, "covers");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Генерируем уникальное имя файла
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            String fileName = UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(fileName);

            // Сохраняем файл
            Files.copy(file.getInputStream(), filePath);

            // Возвращаем относительный путь
            String relativePath = "uploads/covers/" + fileName;

            Map<String, String> response = new HashMap<>();
            response.put("filePath", relativePath);
            response.put("fileName", fileName);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка при загрузке файла: " + e.getMessage());
        }
    }

    @DeleteMapping("/cover")
    public ResponseEntity<?> deleteCover(@RequestParam String filePath) {
        try {
            Path path = Paths.get(filePath);

            if (!Files.exists(path)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Файл не найден: " + filePath);
            }

            Files.delete(path);
            return ResponseEntity.ok("Файл удален: " + filePath);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка при удалении файла: " + e.getMessage());
        }
    }
}