import React, { useState, useEffect, useRef } from "react";
import DashboardHeader from "../components/DashboardHeader";

import { calculateRange } from "../utils/table-pagination";
import { TbEdit } from "react-icons/tb";
import { RiDeleteBin5Line } from "react-icons/ri";
import "./styles.css";
import axiosClient from "../axios-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Major = () => {
  const { token } = useSelector((state) => state.auth);
  const [majors, setMajors] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [isEditing, setIsEditing] = useState({
    edit: false,
    majorId: null,
  });
  const nameRef = useRef();
  const codeRef = useRef();

  useEffect(() => {
    axiosClient.get("list-majors").then(({ data }) => {
      setPagination(
        calculateRange(data.last_page, data.current_page, data.per_page)
      );
      setMajors(data.data);
    });
  }, []);

  // Change Page
  const __handleChangePage = (new_page) => {
    axiosClient.get("list-majors/?page=" + new_page).then(({ data }) => {
      setPage(new_page);
      setPagination(
        calculateRange(data.last_page, data.current_page, data.per_page)
      );
      setMajors(data.data);
    });
  };

  const updateMajorHandle = (id, page) => {
    const payload = {
      name: nameRef.current.value,
      major_code: codeRef.current.value,
    };

    axiosClient
      .put("update-major/" + id, payload)
      .then(() => {
        toast.success("Cập nhật thành công");
        setIsEditing({
          edit: false,
          majorId: null,
        });
      })
      .catch(() => {
        toast.error("Cập nhật thất bại");
      });

    axiosClient.get("list-majors/?page=" + page).then(({ data }) => {
      setPage(page);
      setPagination(
        calculateRange(data.last_page, data.current_page, data.per_page)
      );
      setMajors(data.data);
    });
  };

  const deleteHandler = (id, page) => {
    axiosClient
      .delete("delete-major/" + id)
      .then(() => {
        toast.success("Xóa thành công");
      })
      .catch(() => {
        toast.error("Xóa thất bại");
      });

    axiosClient.get("list-majors/?page=" + page).then(({ data }) => {
      setPage(page);
      setPagination(
        calculateRange(data.last_page, data.current_page, data.per_page)
      );
      setMajors(data.data);
    });
  };

  if (!token) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="dashboard-content">
      <ToastContainer theme="light" />

      <div className="dashboard-content-container">
        <div className="dashboard-content-header">
          <h2>DANH SÁCH NGÀNH HỌC</h2>
        </div>

        <table>
          <thead>
            <th>TÊN NGÀNH</th>
            <th>MÃ NGÀNH</th>
            <th>HÀNH ĐỘNG</th>
          </thead>

          {majors.length !== 0 ? (
            <tbody>
              {majors.map((major, index) => (
                <tr key={index}>
                  <td>
                    <div>
                      {isEditing.edit && isEditing.majorId === major.id ? (
                        <input ref={nameRef} defaultValue={major.name} />
                      ) : (
                        <span>{major.name}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      {isEditing.edit && isEditing.majorId === major.id ? (
                        <input ref={codeRef} defaultValue={major.major_code} />
                      ) : (
                        <span>{major.major_code}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      {isEditing.edit && isEditing.majorId === major.id ? (
                        <button
                          onClick={() => updateMajorHandle(major.id, page)}
                        >
                          Xác nhận lưu
                        </button>
                      ) : (
                        <>
                          <TbEdit
                            onClick={() => {
                              setIsEditing(() => {
                                return {
                                  edit: true,
                                  majorId: major.id,
                                };
                              });
                            }}
                            color="blue"
                            size={24}
                          />
                          <RiDeleteBin5Line
                            onClick={() => deleteHandler(major.id, page)}
                            color="red"
                            size={24}
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>

        {majors.length !== 0 ? (
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

export default Major;
