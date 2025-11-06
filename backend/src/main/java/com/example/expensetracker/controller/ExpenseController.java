package com.example.expensetracker.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.expensetracker.model.Expense;
import com.example.expensetracker.repository.ExpenseRepository;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    private final ExpenseRepository repository;

    public ExpenseController(ExpenseRepository repository) {
        this.repository = repository;
    }

    // DTO for create request
    public static class CreateExpenseRequest {
        @NotBlank
        public String name;

        @NotNull
        @Min(value = 0, message = "Amount must be greater than or equal to 0")
        public BigDecimal amount;

        @NotBlank
        public String date; // expect yyyy-MM-dd
    }

    @GetMapping
    public ResponseEntity<?> listExpenses(@RequestHeader(value = "X-User-Id", required = false) Long userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Missing X-User-Id header"));
        }
        List<Expense> all = repository.findByUserId(userId);
        return ResponseEntity.ok(all);
    }

    @PostMapping
    public ResponseEntity<?> createExpense(@RequestHeader(value = "X-User-Id", required = false) Long userId,
                                           @Valid @RequestBody CreateExpenseRequest req) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Missing X-User-Id header"));
        }
        // Validate date
        LocalDate parsedDate;
        try {
            parsedDate = LocalDate.parse(req.date);
        } catch (DateTimeParseException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid date format. Expected YYYY-MM-DD"));
        }

        if (req.amount.compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Amount must be greater than 0"));
        }

    Expense e = new Expense();
        e.setName(req.name.trim());
        e.setAmount(req.amount.setScale(2, BigDecimal.ROUND_HALF_UP));
        e.setDate(parsedDate);
    e.setUserId(userId);

        Expense saved = repository.save(e);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@RequestHeader(value = "X-User-Id", required = false) Long userId,
                                           @PathVariable("id") Long id) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Missing X-User-Id header"));
        }
        Optional<Expense> found = repository.findById(id);
        if (found.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Expense not found"));
        }
        Expense e = found.get();
        if (!userId.equals(e.getUserId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Not allowed to delete this expense"));
        }
        repository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }

    // Global exception handler methods could be added, but for simplicity we return meaningful responses above.
}
