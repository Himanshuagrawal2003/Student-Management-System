import React from 'react';
import { useParams } from "react-router-dom";
import UpdateForm from '../components/UpdateForm';

function UpdateFormPage() {
  const { model, id } = useParams();
  return <UpdateForm modelName={model} id={id} />;
}

export default UpdateFormPage;
