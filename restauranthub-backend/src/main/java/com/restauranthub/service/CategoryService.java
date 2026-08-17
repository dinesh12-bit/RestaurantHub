package com.restauranthub.service;

import com.restauranthub.dto.request.CategoryRequest;
import com.restauranthub.dto.response.CategoryResponse;
import com.restauranthub.entity.Category;
import com.restauranthub.exception.ResourceNotFoundException;
import com.restauranthub.mapper.CategoryMapper;
import com.restauranthub.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // Add Category
    public CategoryResponse addCategory(CategoryRequest request) {

        if (categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category already exists");
        }

        Category category = CategoryMapper.toEntity(request);

        Category savedCategory = categoryRepository.save(category);

        return CategoryMapper.toResponse(savedCategory);
    }

    public List<CategoryResponse> getAllCategories() {

        return categoryRepository.findAll()
                .stream()
                .map(CategoryMapper::toResponse)
                .toList();
    }

    // Get Category By Id
    public CategoryResponse getCategoryById(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        return CategoryMapper.toResponse(category);
    }

    // Update Category
    public CategoryResponse updateCategory(Long id,
                                           CategoryRequest request) {

        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        existingCategory.setName(request.getName());
        existingCategory.setDescription(request.getDescription());
        existingCategory.setImageUrl(request.getImageUrl());

        Category updatedCategory = categoryRepository.save(existingCategory);

        return CategoryMapper.toResponse(updatedCategory);
    }

    // Delete Category
    // Delete Category
    public void deleteCategory(Long id) {

        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found"));

        categoryRepository.delete(existingCategory);
    }
}