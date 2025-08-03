/* eslint-disable react/prop-types */
import styled from "@emotion/styled";

const ErrorText = styled.p`
  color: red;
  font-size: 15px;
  margin: 10px 0 10px 10px;
`;

const InputErrorMessage = ({ message }) => {
  return <ErrorText>{message}</ErrorText>;
};

export default InputErrorMessage;
