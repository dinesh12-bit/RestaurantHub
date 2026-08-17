package com.restauranthub.service;

import com.restauranthub.dto.request.AdminCategoryRequest;
import com.restauranthub.dto.response.AdminCategoryResponse;
import com.restauranthub.entity.Category;
import com.restauranthub.exception.ResourceNotFoundException;
import com.restauranthub.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminCategoryService {

    private final CategoryRepository categoryRepository;

    public AdminCategoryService(
            CategoryRepository categoryRepository) {

        this.categoryRepository = categoryRepository;
    }

    // =====================================================
    // ADD CATEGORY
    // =====================================================

    @Transactional
    public AdminCategoryResponse addCategory(
            AdminCategoryRequest request) {

        if (categoryRepository.existsByName(
                request.getName())) {

            throw new RuntimeException(
                    "Category already exists"
            );
        }

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        Category savedCategory =
                categoryRepository.save(category);

        return toResponse(savedCategory);
    }


    // =====================================================
    // GET ALL CATEGORIES
    // =====================================================

    public List<AdminCategoryResponse> getAllCategories() {

        return categoryRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // =====================================================
    // GET CATEGORY BY ID
    // =====================================================

    public AdminCategoryResponse getCategoryById(
            Long id) {

        Category category =
                categoryRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Category not found"
                                )
                        );

        return toResponse(category);
    }


    // =====================================================
    // UPDATE CATEGORY
    // =====================================================

    @Transactional
    public AdminCategoryResponse updateCategory(
            Long id,
            AdminCategoryRequest request) {

        Category category =
                categoryRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Category not found"
                                )
                        );


        // Check duplicate name
        categoryRepository.findByName(
                request.getName()
        ).ifPresent(existing -> {

            if (!existing.getId().equals(id)) {

                throw new RuntimeException(
                        "Category already exists"
                );
            }
        });


        category.setName(
                request.getName()
        );

        category.setDescription(
                request.getDescription()
        );


        Category updatedCategory =
                categoryRepository.save(category);

        return toResponse(updatedCategory);
    }


    // =====================================================
    // DELETE CATEGORY
    // =====================================================

    @Transactional
    public void deleteCategory(Long id) {

        Category category =
                categoryRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Category not found"
                                )
                        );


        categoryRepository.delete(category);
    }


    // =====================================================
    // ENTITY → RESPONSE
    // =====================================================

    private AdminCategoryResponse toResponse(
            Category category) {

        return AdminCategoryResponse.builder()

                .id(category.getId())

                .name(category.getName())

                .description(
                        category.getDescription()
                )

                .build();
    }
}