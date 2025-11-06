package com.example.expensetracker.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    // store amounts as decimal(15,2)
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDate date;

    // associate expense with a user (simple relation by id)
    // allow null initially for existing data; application enforces header on endpoints
    @Column(name = "user_id", nullable = true)
    private Long userId;

    public Expense() {}

    public Expense(String name, BigDecimal amount, LocalDate date) {
        this.name = name;
        this.amount = amount;
        this.date = date;
    }

    public Expense(String name, BigDecimal amount, LocalDate date, Long userId) {
        this.name = name;
        this.amount = amount;
        this.date = date;
        this.userId = userId;
    }

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public LocalDate getDate() {
        return date;
    }

    public Long getUserId() {
        return userId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
