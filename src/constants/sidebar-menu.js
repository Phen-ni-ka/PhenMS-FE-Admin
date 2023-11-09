import { PiStudentBold } from "react-icons/pi";
import { RiHandbagFill } from "react-icons/ri";
import { SiGoogleclassroom } from "react-icons/si";
import { ImBook } from "react-icons/im";
import { AiTwotoneMail } from "react-icons/ai";
const sidebar_menu = [
  {
    id: 1,
    icon: <PiStudentBold size={20} />,
    path: "/student",
    title: "Sinh viên",
  },
  {
    id: 2,
    icon: <RiHandbagFill size={20} />,
    path: "/teacher",
    title: "Giảng viên",
  },
  {
    id: 3,
    icon: <SiGoogleclassroom size={20} />,
    path: "/subject",
    title: "Môn học",
  },
  {
    id: 4,
    icon: <ImBook size={20} />,
    path: "/major",
    title: "Ngành học",
  },
  {
    id: 5,
    icon: <AiTwotoneMail size={20} />,
    path: "/issue",
    title: "Đơn từ",
  },
];

export default sidebar_menu;
