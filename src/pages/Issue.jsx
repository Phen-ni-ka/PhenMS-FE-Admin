import React, { useState, useEffect } from "react";
import DashboardHeader from "../components/DashboardHeader";

import { calculateRange } from "../utils/table-pagination";
import { TiTick } from "react-icons/ti";
import { MdCancel } from "react-icons/md";
import "./styles.css";
import axiosClient from "../axios-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Issue = () => {
  const { token } = useSelector((state) => state.auth);
  const [issues, setIssues] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);

  useEffect(() => {
    axiosClient.get("list-issues").then(({ data }) => {
      setPagination(
        calculateRange(data.last_page, data.current_page, data.per_page)
      );
      setIssues(data.data);
    });
  }, []);

  // Change Page
  const __handleChangePage = (new_page) => {
    axiosClient.get("list-issues/?page=" + new_page).then(({ data }) => {
      setPage(new_page);
      setPagination(
        calculateRange(data.last_page, data.current_page, data.per_page)
      );
      setIssues(data.data);
    });
  };

  const processIssue = (id, status, page) => {
    axiosClient
      .put("update-issue/" + id, {
        status_id: status,
      })
      .then(() => {
        toast.success("Cập nhật trạng thái thành công");
      })
      .catch(() => {
        toast.error("Cập nhật trạng thái thất bại");
      });

    axiosClient.get("list-issues/?page=" + page).then(({ data }) => {
      setPage(page);
      setPagination(
        calculateRange(data.last_page, data.current_page, data.per_page)
      );
      setIssues(data.data);
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
          <h2>DANH SÁCH BÁO CÁO</h2>
        </div>

        <table>
          <thead>
            <th>TIÊU ĐỀ</th>
            <th>TÊN SINH VIÊN</th>
            <th>EMAIL SINH VIÊN</th>
            <th>TRẠNG THÁI</th>
            <th>HÀNH ĐỘNG</th>
          </thead>

          {issues.length !== 0 ? (
            <tbody>
              {issues.map((issue, index) => (
                <tr key={index}>
                  <td>
                    <div>
                      <span>{issue.title}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{issue.student_name}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{issue.student_email}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{issue.status_string}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <TiTick
                        onClick={() => processIssue(issue.id, 3, page)}
                        color="green"
                        size={24}
                      />
                      <MdCancel
                        onClick={() => processIssue(issue.id, 4, page)}
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

        {issues.length !== 0 ? (
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

export default Issue;
