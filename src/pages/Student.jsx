import React, { useState, useEffect, useRef } from "react";
import DashboardHeader from "../components/DashboardHeader";

import { calculateRange } from "../utils/table-pagination";
import { TbEdit } from "react-icons/tb";
import { MdRemoveRedEye } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import "./styles.css";
import axiosClient from "../axios-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Student = () => {
  const { token } = useSelector((state) => state.auth);
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  let inputRef = useRef();

  useEffect(() => {
    axiosClient.get("list-students").then(({ data }) => {
      setPagination(
        calculateRange(data.last_page, data.current_page, data.per_page)
      );
      setStudents(data.data);
    });
  }, []);

  // Change Page
  const __handleChangePage = (new_page) => {
    axiosClient.get("list-students/?page=" + new_page).then(({ data }) => {
      setPage(new_page);
      setStudents(data.data);
      setPagination(
        calculateRange(data.last_page, data.current_page, data.per_page)
      );
    });
  };

  const addStudentHandle = () => {
    var formdata = new FormData();
    formdata.append("csv_file", inputRef.current.files[0]);

    axiosClient
      .post("create-students", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(({ data }) => {
        toast.success(
          "Thêm mới " + data.total_success + " sinh viên thành công"
        );
        toast.warning("Thêm mới " + data.total_err + " sinh viên thất bại");
      })
      .catch(() => {
        toast.error("Thêm mới thất bại");
      });

    inputRef = null;

    axiosClient.get("list-students/?page=" + page).then(({ data }) => {
      setPagination(
        calculateRange(data.last_page, data.current_page, data.per_page)
      );
      setStudents(data.data);
    });
  };

  const deleteHandler = (id) => {
    axiosClient
      .delete("delete-student/" + id)
      .then(() => {
        toast.success("Xóa thành công");
      })
      .catch(() => {
        toast.error("Xóa thất bại");
      });

    axiosClient.get("list-students/?page=" + page).then(({ data }) => {
      setPagination(
        calculateRange(data.last_page, data.current_page, data.per_page)
      );
      setStudents(data.data);
    });
  };

  if (!token) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="dashboard-content">
      <div className="dashboard-content-header">
        <div className="dashbord-header-container">
          <label className="file-input__label" for="file-input">
            Thêm mới sinh viên
          </label>
          <input
            ref={inputRef}
            className="file-input__input"
            id="file-input"
            type="file"
          />
          <label
            style={{ marginLeft: "12px" }}
            onClick={addStudentHandle}
            className="file-input__label"
          >
            Xác nhận tải lên
          </label>
        </div>
      </div>
      <ToastContainer theme="light" />
      <div className="dashboard-content-container">
        <div className="dashboard-content-header">
          <h2>DANH SÁCH SINH VIÊN</h2>
        </div>

        <table>
          <thead>
            <th>ID</th>
            <th>ẢNH</th>
            <th>EMAIL</th>
            <th>HỌ VÀ TÊN</th>
            <th>MÃ SINH VIÊN</th>
            <th>KHÓA</th>
            <th>HÀNH ĐỘNG</th>
          </thead>

          {students.length !== 0 ? (
            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td>
                    <span>{student.id}</span>
                  </td>
                  <td>
                    <div>
                      <img
                        src={
                          student.avatar_url ??
                          "https://islamicacademyofhuntsville.org/wp-content/uploads/2023/05/PlaceholderPerson.jpg"
                        }
                        className="dashboard-content-avatar"
                        alt={"avatar"}
                      />
                    </div>
                  </td>
                  <td>
                    <span>{student.email}</span>
                  </td>
                  <td>
                    <div>
                      <span>{student.fullname}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{student.student_code}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>K{student.school_year}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <MdRemoveRedEye color="green" size={24} />
                      <TbEdit color="blue" size={24} />
                      <RiDeleteBin5Line
                        onClick={() => {
                          deleteHandler(student.id);
                        }}
                        color="red"
                        size={24}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>

        {students.length !== 0 ? (
          <div className="dashboard-content-footer">
            {pagination.map((item, index) => (
              <span
                key={index}
                className={item === page ? "active-pagination" : "pagination"}
                onClick={() => __handleChangePage(item)}
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <div className="dashboard-content-footer">
            <span className="empty-table">No data</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Student;
