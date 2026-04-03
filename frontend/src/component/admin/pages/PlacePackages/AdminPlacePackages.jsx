import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AdminPlaceContext } from '../../context/AdminPlaceContext';
import style from './AdminPlacePackages.module.css'
import AdminPackageCard from '../../components/packageCard/AdminPackageCard';
import PackageForm from '../../components/PackageForm/PackageForm';
import DeleteConfirm from '../../components/deleteConformation/DeletePlace';

export default function AdminPlacePackages() {



  const { adminPlaceList } = useContext(AdminPlaceContext)
  const { name } = useParams();
  const [packages, setPackages] = useState([]);

  const [pack, setPack] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const [deletePackId, setDeletePackId] = useState(null);
  const [savedPlace, setSavedPlace] = useState(null);

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


  const handlePackages = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/packages/${place._id}`);

      const data = await res.json();
      if (data.success) {
        setPackages(data.data.packages);
      }
    } catch (err) {
      alert(err);
    }

  }

  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 3;

  const totalPages = Math.ceil(packages.length / itemPerPage);

  const startIndex = (currentPage - 1) * itemPerPage;
  const endIndex = startIndex + itemPerPage;

  const currentPackages = packages.slice(startIndex, endIndex);

  console.log('totalPage', totalPages, '--currentPage', currentPage);

  useEffect(() => {
    if (place?._id) {
      handlePackages();
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
        handlePackages();
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
        {currentPackages.map((pack) => (
          <AdminPackageCard
            pack={pack}
            onEdit={() => {
              setPack(pack);
              setFormOpen(true);
            }}
            onDelete={() => setDeletePackId(pack._id)}
          />
        ))}
      </div>
      <div className={style.paginaton}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          prev
        </button>
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;
          return (<button
            key={index}
            onClick={() => setCurrentPage(pageNumber)}
            className={currentPage === pageNumber ? style.active : ''}
          >
            {index + 1}
          </button>
          )
        })}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}

        >
          Next
        </button>
      </div>
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
              handlePackages();
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
