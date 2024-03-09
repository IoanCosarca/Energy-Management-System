package com.utcn.devicesmicroservice.model;

public class IDResponse {
    private Long id;

    public IDResponse() {}

    public IDResponse(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
