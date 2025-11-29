package com.justice.ticketing.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommentRequest {
    @NotBlank(message = "Le contenu du commentaire est requis")
    private String contenu;
    
    private Boolean isInternal = false;
}
