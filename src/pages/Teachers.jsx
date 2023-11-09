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

const Teachers = () => {
  const { token } = useSelector((state) => state.auth);
  const [teachers, setTeachers] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  let inputRef = useRef();

  useEffect(() => {
    axiosClient.get("list-teachers").then(({ data }) => {
      setPagination(
        calculateRange(data.last_page, data.current_page, data.per_page)
      );
      setTeachers(data.data);
    });
  }, []);

  // Change Page
  const __handleChangePage = (new_page) => {
    axiosClient.get("list-teachers/?page=" + new_page).then(({ data }) => {
      setPage(new_page);
      setPagination(
        calculateRange(data.last_page, data.current_page, data.per_page)
      );
      setTeachers(data.data);
    });
  };

  const addStudentHandle = () => {
    var formdata = new FormData();
    formdata.append("csv_file", inputRef.current.files[0]);

    axiosClient
      .post("create-teachers", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(({ data }) => {
        toast.success(
          "Thêm mới " + data.total_success + " giảng viên thành công"
        );
        toast.warning("Thêm mới " + data.total_err + " giảng viên thất bại");
      })
      .catch(() => {
        toast.error("Thêm mới thất bại");
      });

    inputRef = null;

    axiosClient.get("list-teachers/?page=" + page).then(({ data }) => {
      setPagination(
        calculateRange(data.last_page, data.current_page, data.per_page)
      );
      setTeachers(data.data);
    });
  };

  if (!token) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="dashboard-content">
      <ToastContainer theme="light" />
      <div className="dashboard-content-header">
        <div className="dashbord-header-container">
          <label className="file-input__label" for="file-input">
            Thêm mới giảng viên
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

      <div className="dashboard-content-container">
        <div className="dashboard-content-header">
          <h2>DANH SÁCH GIẢNG VIÊN</h2>
        </div>

        <table>
          <thead>
            <th>ID</th>
            <th>ẢNH</th>
            <th>EMAIL</th>
            <th>HỌ VÀ TÊN</th>
            <th>MÃ GIẢNG VIÊN</th>
            <th>HÀNH ĐỘNG</th>
          </thead>

          {teachers.length !== 0 ? (
            <tbody>
              {teachers.map((teacher, index) => (
                <tr key={index}>
                  <td>
                    <span>{teacher.id}</span>
                  </td>
                  <td>
                    <div>
                      <img
                        src={
                          teacher.avatar_url ??
                          "https://islamicacademyofhuntsville.org/wp-content/uploads/2023/05/PlaceholderPerson.jpg"
                        }
                        className="dashboard-content-avatar"
                        alt={"avatar"}
                      />
                    </div>
                  </td>
                  <td>
                    <span>{teacher.email}</span>
                  </td>
                  <td>
                    <div>
                      <span>{teacher.fullname}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{teacher.teacher_code}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <MdRemoveRedEye color="green" size={24} />
                      <TbEdit color="blue" size={24} />
                      <RiDeleteBin5Line color="red" size={24} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>

        {teachers.length !== 0 ? (
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

export default Teachers;
