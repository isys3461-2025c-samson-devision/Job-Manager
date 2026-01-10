package com.devision.job_manager_backend.modules.applicantsearch.dto.request;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

public class CommaSeparatedListDeserializer extends JsonDeserializer<List<String>> {

    @Override
    public List<String> deserialize(JsonParser parser, DeserializationContext ctxt)
            throws IOException {
        JsonToken token = parser.currentToken();

        if (token == JsonToken.VALUE_STRING) {
            String value = parser.getValueAsString();
            if (value == null || value.trim().isEmpty()) {
                return List.of();
            }

            String[] parts = value.split(",");
            List<String> result = new ArrayList<>();
            for (String part : parts) {
                String trimmed = part.trim();
                if (!trimmed.isEmpty()) {
                    result.add(trimmed);
                }
            }
            return result;
        }

        if (token == JsonToken.START_ARRAY) {
            List<String> result = new ArrayList<>();
            while (parser.nextToken() != JsonToken.END_ARRAY) {
                if (parser.currentToken() == JsonToken.VALUE_STRING) {
                    result.add(parser.getValueAsString());
                } else {
                    result.add(parser.readValueAs(String.class));
                }
            }
            return result;
        }

        return ctxt.readValue(parser, ctxt.getTypeFactory().constructCollectionType(List.class, String.class));
    }

}