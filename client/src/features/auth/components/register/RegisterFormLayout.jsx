import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RegisterInput } from "./RegisterInput";
import { PasswordInput } from "./PasswordInput";

export const RegisterFormLayout = ({
  formData,
  handleChange,
  handleSubmit,
  loading,
  message,
  errors, 
  toggles, 
  toggleHandlers
}) => {
  const { 
    fnameError, lnameError, ageError, emailError, phoneError, 
    experienceError, patientfnameError, patientlnameError, patientAgeError, 
    passwordErrors, confirmPasswordError 
  } = errors;

  const { showDoctorFields, showPatientFields, showPassword, showConfirmPassword } = toggles;
  const { toggleShowPassword, toggleShowConfirmPassword } = toggleHandlers;

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4 text-center text-success">
        Създайте своя MedConnect акаунт
      </h3>

      {message && (
        <Alert variant="info" className="d-flex align-items-center">
          {loading && (
            <Spinner animation="border" size="sm" className="me-2" role="status" />
          )}
          <span>{message}</span>
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <RegisterInput
          label="Име"
          name="fname"
          placeholder="Въведете вашето име"
          value={formData.fname}
          onChange={handleChange}
          error={fnameError}
        />

        <RegisterInput
          label="Фамилия"
          type="text"
          name="lname"
          placeholder="Въведете вашата фамилия"
          value={formData.lname}
          onChange={handleChange}
          error={lnameError}
        />

        <RegisterInput
          label="Възраст"
          type="number"
          name="age"
          placeholder="Въведете вашата възраст"
          value={formData.age}
          onChange={handleChange}
          min="18"
          max="120"
          error={ageError}
        />

        <RegisterInput
          label="Имейл"
          type="email"
          name="email"
          placeholder="Въведете вашия имейл"
          value={formData.email}
          onChange={handleChange}
          error={emailError}
        />

        <RegisterInput
          label="Телефонен номер"
          type="text"
          name="phone"
          placeholder="Въведете вашия телефонен номер"
          value={formData.phone}
          onChange={handleChange}
          required
          error={phoneError}
        />

        {formData.role !== "guardian" && (
          <Form.Group className="mb-3">
            <Form.Label>Профилна снимка</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              name="photo"
              onChange={handleChange} 
            />
          </Form.Group>
        )}

        <PasswordInput
          label="Парола"
          name="password"
          value={formData.password}
          onChange={handleChange}
          showPassword={showPassword}
          toggleShowPassword={toggleShowPassword}
          passwordErrors={passwordErrors}
        />

        <PasswordInput
          label="Потвърдете паролата"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          showPassword={showConfirmPassword}
          toggleShowPassword={toggleShowConfirmPassword}
          passwordErrors={confirmPasswordError ? [confirmPasswordError] : []}
        />

        <Form.Group className="mb-3">
          <Form.Label>Роля</Form.Label>
          <Form.Select name="role" value={formData.role} onChange={handleChange}>
            <option value="patient">Пациент</option>
            <option value="guardian">Настойник</option>
            <option value="doctor">Лекар</option>
          </Form.Select>
        </Form.Group>

        {showPatientFields && (
          <>
            <h6 className="mt-3 text-secondary">Детайли за пациента</h6>
            <Form.Group className="mb-3">
              <Form.Label>Име на пациента</Form.Label>
              <Form.Control
                type="text"
                name="patientFName"
                placeholder="Въведете име на пациента"
                value={formData.patientFName}
                onChange={handleChange}
                required
              />
              {patientfnameError && (
                <p className="text-danger small mt-1">{patientfnameError}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Фамилия на пациента</Form.Label>
              <Form.Control
                type="text"
                name="patientLName"
                placeholder="Въведете фамилия на пациента"
                value={formData.patientLName}
                onChange={handleChange}
                required
              />
              {patientlnameError && (
                <p className="text-danger small mt-1">{patientlnameError}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Възраст на пациента</Form.Label>
              <Form.Control
                type="number"
                name="patientAge"
                placeholder="Въведете възрастта на пациента"
                min="0"
                max="120"
                value={formData.patientAge}
                onChange={handleChange}
                required
              />
              {patientAgeError && (
                <p className="text-danger small mt-1">{patientAgeError}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Профилна снимка</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                name="photo"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Пациент с увреждания</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Да"
                  name="hasDisability"
                  value="yes"
                  checked={formData.hasDisability === "yes"}
                  onChange={handleChange}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Не"
                  name="hasDisability"
                  value="no"
                  checked={formData.hasDisability === "no"}
                  onChange={handleChange}
                />
              </div>
            </Form.Group>

            {formData.hasDisability === "yes" && (
              <Form.Group className="mb-3">
                <Form.Label>Описание на увреждането</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="disabilityDetails"
                  placeholder="Опишете увреждането на пациента"
                  value={formData.disabilityDetails}
                  onChange={handleChange}
                />
              </Form.Group>
            )}
          </>
        )}

        {showDoctorFields && (
          <>
            <h6 className="mt-3 text-secondary">Детайли за лекар</h6>
            <Form.Group className="mb-3">
              <Form.Label>Специализация</Form.Label>
              <Form.Control
                type="text"
                name="specialization"
                placeholder="Въведете вашата специализация"
                value={formData.specialization}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Опит (години)</Form.Label>
              <Form.Control
                type="number"
                name="experience"
                placeholder="Въведете вашите години опит"
                value={formData.experience}
                onChange={handleChange}
                required
                min="1"
                max="50"
              />
              {experienceError && (
                <p className="text-danger small mt-1">{experienceError}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Град</Form.Label>
              <Form.Control
                type="text"
                name="city"
                placeholder="Въведете вашия град"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Кабинет</Form.Label>
              <Form.Control
                type="text"
                name="hospital"
                placeholder="Въведете вашето работно място"
                value={formData.hospital}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </>
        )}

        <Button type="submit" variant="success" className="w-100">
          Регистрация
        </Button>

        <div className="text-center mt-2">
          <p className="text-muted">
            Вече имате акаунт?{" "}
            <Link
              to="/login"
              className="text-success fw-semibold text-decoration-none"
            >
              Вход
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
};