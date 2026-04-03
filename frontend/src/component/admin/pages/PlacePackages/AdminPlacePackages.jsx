import React, { useContext, useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { AdminPlaceContext } from '../../context/AdminPlaceContext';
import style from './AdminPlacePackages.module.css'
import AdminPackageCard from '../../components/packageCard/AdminPackageCard';
import PackageForm from '../../components/PackageForm/PackageForm';
import DeleteConfirm from '../../components/deleteConformation/DeletePlace';

const LIMIT = 4;

export default function AdminPlacePackages() {

  const { adminPlaceList } = useContext(AdminPlaceContext);
  const { name } = useParams();
  const [packages, setPackages] = useState([]);

  const [pack, setPack] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const [deletePackId, setDeletePackId] = useState(null);
  const [savedPlace, setSavedPlace] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const stored = localStorage.getItem("storedPlace");
    if (stored) {
      setSavedPlace(JSON.parse(stored));
    }
  }, []);

  const contextPlace = adminPlaceList.find(p => p.name.toLowerCase() === name.toLowerCase());

  useEffect(() => {
    if (contextPlace) {
      localStorage.setItem("storedPlace", JSON.stringify(contextPlace));
    }
  }, [contextPlace]);

  const place = contextPlace || savedPlace;

  const handlePackages = useCallback(async (page = 1) => {
    if (!place?._id) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/packages/${place._id}?page=${page}&limit=${LIMIT}`
      );

      const data = await res.json();
      if (data.success) {
        setPackages(data.data.packages);
        setTotalPages(data.data.pagination.totalPages);
        setCurrentPage(data.data.pagination.page);
      }
    } catch (err) {
      console.log(err);
    }
  }, [place?._id]);

  useEffect(() => {
    if (place?._id) {
      handlePackages(1);
    }
  }, [place]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/v1/packages/${deletePackId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (data.success) {
        // If we delete the last item on a page, jump back one page
        const targetPage = packages.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;
        handlePackages(targetPage);
        setDeletePackId(null);
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div
        className={style.cover}
        style={{
          backgroundImage: `url(${place?.image})`
        }}
      >
        <div className={style.overlay}></div>

        <div className={style.content}>
          <h1 className={style.head}>{place?.name}</h1>
          <p className={style.cat}>{place?.category}</p>
        </div>
      </div>
      <div className={style.HeadingSec}>
        <h1>Packages</h1>

        <div>
          <div className={style.addButton}>
            <h4 className={style.h4}>Add Package</h4>
            <span
              className={style.plusButton}
              onClick={() => {
                setPack(null);
                setFormOpen(true);
              }}
            >+</span>
          </div>
        </div>
      </div>
      <div className={style.packageGrid}>
        {packages.map((pack) => (
          <AdminPackageCard
            key={pack._id}
            pack={pack}
            onEdit={() => {
              setPack(pack);
              setFormOpen(true);
            }}
            onDelete={() => setDeletePackId(pack._id)}
          />
        ))}
      </div>

      {/* Server-driven pagination */}
      {totalPages > 1 && (
        <div className={style.paginaton}>
          <button
            disabled={currentPage === 1}
            onClick={() => handlePackages(currentPage - 1)}
          >
            prev
          </button>
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={index}
                onClick={() => handlePackages(pageNumber)}
                className={currentPage === pageNumber ? style.active : ''}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePackages(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}

      {
        formOpen && (
          <PackageForm
            pack={pack}
            place={place}
            onClose={() => {
              setPack(null);
              setFormOpen(false);
            }}
            onSuccess={() => {
              handlePackages(currentPage);
              setFormOpen(false);
              setPack(null);
            }}
          />
        )
      }

      {deletePackId && (
        <DeleteConfirm
          onClose={() => setDeletePackId(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
