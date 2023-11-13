import React, { useState, useEffect, useRef } from "react";
import DashboardHeader from "../components/DashboardHeader";

import { calculateRange } from "../utils/table-pagination";
import { TbEdit } from "react-icons/tb";
import { MdRemoveRedEye } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import "./styles.css";
import axiosClient from "../axios-client";
import { Navigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const Class = () => {
  const { token } = useSelector((state) => state.auth);
  const { subjectId } = useParams();
  const [classes, setClasses] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const nameRef = useRef();
  const maxRef = useRef();
  const teacherRef = useRef();
  const statusRef = useRef();

  useEffect(() => {
    axiosClient.get("list-classes/" + subjectId).then(({ data }) => {
      setClasses(data);
    });
  }, []);

  const deleteSubjectHandle = (id) => {
    console.log(id);

    axiosClient.delete("/delete-class/" + id).then(() => {});
  };

  const addClassHandle = (event) => {
    event.preventDefault();
    console.log(nameRef.current.value);
    const payload = {
      name: nameRef.current.value,
      max_students: maxRef.current.value,
      subject_id: subjectId,
      teacher_id: teacherRef.current.value,
      status: statusRef.current.value,
    };

    axiosClient
      .post("create-class", payload)
      .then(() => {
        toast.success("Tạo mới thành công");
      })
      .catch(() => {
        toast.error("Tạo mới thất bại");
      });

    axiosClient.get("list-classes/" + subjectId).then(({ data }) => {
      setClasses(data);
      setIsAdding(false);
    });
  };

  if (!token) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="dashboard-content">
      <ToastContainer theme="light" />

      {isAdding ? (
        <>
          <div className="dashboard-content-container">
            <div className="dashboard-content-header">
              <h2>Điền thông tin lớp học</h2>
            </div>
            <form className="form-add" onSubmit={addClassHandle}>
              <div className="form-element">
                <label for="name">Tên lớp</label>
                <input ref={nameRef} id="name" />
              </div>
              <div className="form-element">
                <label for="max_students">Số lượng sinh viên tối đa</label>
                <input ref={maxRef} type="number" id="max_students" />
              </div>
              <div className="form-element">
                <label for="teacherId">Giảng viên (theo id)</label>
                <input ref={teacherRef} type="number" id="teacherId" />
              </div>
              <div className="form-element">
                <label for="max_students">Trạng thái</label>
                <select ref={statusRef}>
                  <option value={0}>Không thể đăng ký</option>
                  <option value={1}>Có thể đăng ký</option>
                  <option value={2}>Đang học</option>
                  <option value={3}>Đã kết thúc</option>
                </select>
              </div>
              <button type="submit" className="form-element">
                Tạo mới lớp học
              </button>
            </form>
          </div>
        </>
      ) : (
        <>
          <DashboardHeader
            btnText="Thêm Lớp"
            onClick={() => {
              setIsAdding(true);
            }}
          />

          <div className="dashboard-content-container">
            <div className="dashboard-content-header">
              <h2>DANH SÁCH LỚP HỌC</h2>
            </div>

            <table>
              <thead>
                <th>TÊN LỚP</th>
                <th>TỐI ĐA</th>
                <th>CÒN LẠI</th>
                <th>GIẢNG VIÊN</th>
                <th>TRẠNG THÁI</th>
                <th>DANH SÁCH LỚP</th>
                <th>HÀNH ĐỘNG</th>
              </thead>

              {classes.length !== 0 ? (
                <tbody>
                  {classes.map((el, index) => (
                    <tr key={index}>
                      <td>
                        <span>{el.class_name}</span>
                      </td>
                      <td>
                        <span>{el.max_students}</span>
                      </td>
                      <td>
                        <span>{el.remain_slot}</span>
                      </td>
                      <td>
                        <div>
                          <span>{el.teacher_name}</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <span>{el.status_string}</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <button>Xem danh sách lớp</button>
                        </div>
                      </td>
                      <td>
                        <div>
                          <TbEdit color="blue" size={24} />
                          <RiDeleteBin5Line
                            color="red"
                            size={24}
                            onClick={() => deleteSubjectHandle(el.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : null}
            </table>

            {classes.length === 0 ? (
              <div className="dashboard-content-footer">
                <span className="empty-table">No data</span>
              </div>
            ) : (
              ""
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Class;
