import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function DynamicForm({ modelName }) {
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchModelSchema();
  }, []);

  const fetchModelSchema = async () => {
    try {
      const response = await fetch(`/api/${modelName.toLowerCase()}/getForm`);
      const data = await response.json();
      const modelSchema = Array.isArray(data) ? data[0] : data;

      if (!modelSchema || !Object.keys(modelSchema).length) {
        

        setErrorMessage("No fields found in model schema.");
        return;
      }

      const fieldNames = Object.keys(modelSchema);
      setFields(fieldNames);
    } catch (error) {
      setErrorMessage(`Error fetching model schema: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/${modelName.toLowerCase()}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage(`${modelName} created successfully.`);
        setErrorMessage(null);
        setFormData({});
      } else {
        const errorMsg = await response.text();
        setErrorMessage(`Failed to create ${modelName}: ${errorMsg}`);
        setSuccessMessage(null);
      }
    } catch (error) {
      setErrorMessage(`Error creating ${modelName}: ${error.message}`);
      setSuccessMessage(null);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          boxShadow: 2,
          p: 3,
          borderRadius: 2,
          width: "100%",
          maxWidth: 450,
          margin: "auto",
          mt: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add {capitalizeFirstLetter(modelName)}
        </Typography>

        <form onSubmit={handleSubmit}>
          {fields.map((fieldName) => (
            <TextField
              key={fieldName}
              label={`* ${capitalizeFirstLetter(fieldName)}${
                fieldName === "dob" ? " (YYYY-MM-DD)" : ""
              }${fieldName === "gender" ? " (Male/Female)" : ""}`}
              fullWidth
              margin="normal"
              id={fieldName}
              value={formData[fieldName] || ""}
              onChange={handleChange}
              inputProps={
                fieldName === "email"
                  ? {
                      inputMode: "email",
                      pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
                    }
                  : {}
              }
            />
          ))}

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Submit
          </Button>
        </form>

        {errorMessage && (
          <Typography variant="body2" color="error" mt={2}>
            {errorMessage}
          </Typography>
        )}

        {successMessage && (
          <Typography variant="body2" sx={{ color: "#4caf50", mt: 2 }}>
            {successMessage}
          </Typography>
        )}
      </Box>
    </>
  );
}

export default DynamicForm;
