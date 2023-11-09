import React, { useState, useEffect, useRef } from "react";
import DashboardHeader from "../components/DashboardHeader";

import { calculateRange } from "../utils/table-pagination";
import { TbEdit } from "react-icons/tb";
import { RiDeleteBin5Line } from "react-icons/ri";
import "./styles.css";
import axiosClient from "../axios-client";
import { Link, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const Subject = () => {
  const { token } = useSelector((state) => state.auth);
  const [subjects, setSubjects] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [isEditing, setIsEditing] = useState({
    edit: false,
    subjectId: null,
  });

  const nameRef = useRef();
  const theoryRef = useRef();
  const practiceRef = useRef();
  const semesterRef = useRef();
  const schoolYearRef = useRef();
  const creditRef = useRef();

  useEffect(() => {
    axiosClient.get("list-subjects").then(({ data }) => {
      setPagination(
        calculateRange(data.last_page, data.current_page, data.per_page)
      );
      setSubjects(data.data);
    });
  }, []);

  // Change Page
  const __handleChangePage = (new_page) => {
    axiosClient.get("list-subjects/?page=" + new_page).then(({ data }) => {
      setPage(new_page);
      setSubjects(data.data);
      setPagination(
        calculateRange(data.last_page, data.current_page, data.per_page)
      );
    });
  };

  const updateSubjectHandle = (id, page) => {
    const payload = {
      name: nameRef.current.value,
      total_period_theory: theoryRef.current.value,
      total_period_practice: practiceRef.current.value,
      semester: semesterRef.current.value,
      school_year: schoolYearRef.current.value,
      credit: creditRef.current.value,
    };

    axiosClient
      .put("update-subject/" + id, payload)
      .then(() => {
        toast.success("Cập nhật thành công");
        setIsEditing({
          edit: false,
          subjectId: null,
        });
      })
      .catch(() => {
        toast.error("Cập nhật thất bại");
      });

    axiosClient.get("list-subjects/?page=" + page).then(({ data }) => {
      setPage(page);
      setPagination(
        calculateRange(data.last_page, data.current_page, data.per_page)
      );
      setSubjects(data.data);
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
          <h2>DANH SÁCH MÔN HỌC</h2>
        </div>

        <table>
          <thead>
            <th>TÊN MÔN HỌC</th>
            <th>TỔNG SỐ TIẾT LÍ THUYẾT</th>
            <th>TỔNG SỐ TIẾT THỰC HÀNH</th>
            <th>SỐ TÍN</th>
            <th>HỌC KÌ</th>
            <th>KHÓA</th>
            <th>LỚP</th>
            <th>HÀNH ĐỘNG</th>
          </thead>

          {subjects.length !== 0 ? (
            <tbody>
              {subjects.map((subject, index) => (
                <tr key={index}>
                  <td>
                    {isEditing.edit && isEditing.subjectId === subject.id ? (
                      <input ref={nameRef} defaultValue={subject.name} />
                    ) : (
                      <span>{subject.name}</span>
                    )}
                  </td>
                  <td>
                    <div>
                      {isEditing.edit && isEditing.subjectId === subject.id ? (
                        <input
                          ref={theoryRef}
                          defaultValue={subject.total_period_theory}
                        />
                      ) : (
                        <span>{subject.total_period_theory}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      {isEditing.edit && isEditing.subjectId === subject.id ? (
                        <input
                          ref={practiceRef}
                          defaultValue={subject.total_period_practice}
                        />
                      ) : (
                        <span>{subject.total_period_practice}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      {isEditing.edit && isEditing.subjectId === subject.id ? (
                        <input ref={creditRef} defaultValue={subject.credit} />
                      ) : (
                        <span>{subject.credit}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      {isEditing.edit && isEditing.subjectId === subject.id ? (
                        <input
                          ref={semesterRef}
                          defaultValue={subject.semester}
                        />
                      ) : (
                        <span>{subject.semester}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      {isEditing.edit && isEditing.subjectId === subject.id ? (
                        <input
                          ref={schoolYearRef}
                          defaultValue={subject.school_year}
                        />
                      ) : (
                        <span>K{subject.school_year}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      <Link to={"/class/" + subject.id}>
                        <button>Xem lớp</button>
                      </Link>
                    </div>
                  </td>
                  <td>
                    <div>
                      {isEditing.edit && isEditing.subjectId === subject.id ? (
                        <button
                          onClick={() => updateSubjectHandle(subject.id, page)}
                        >
                          Xác nhận lưu
                        </button>
                      ) : (
                        <>
                          <TbEdit
                            onClick={() => {
                              setIsEditing({
                                edit: true,
                                subjectId: subject.id,
                              });
                            }}
                            color="blue"
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

        {subjects.length !== 0 ? (
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

export default Subject;
