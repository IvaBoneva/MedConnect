import { useParams } from "react-router-dom";
import PersonalInformation from "../../../features/dashboards/patient/pages/PersonalInformation";
import DoctorPersonalInformation from "../../../features/doctors/DoctorPersonalInformation";
import { usersMock } from "../mock data/Users";

const UserDetailsPage = () => {
  const { id } = useParams();
  const userId = parseInt(id, 10);

  const user = usersMock.find(u => u.id === userId);

  if (!user) return <p>Потребителят не е намерен</p>;

  return (
    <div>
      {user.role === "DOCTOR" ? (
        <DoctorPersonalInformation user={user} />
      ) : (
        <PersonalInformation user={user} />
      )}
    </div>
  );
};

export default UserDetailsPage;
