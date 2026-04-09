import React, { useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom'
import { AdminPlaceContext } from '../../context/AdminPlaceContext';
import style from './AdminPlacePackages.module.css'
import AdminPackageCard from '../../components/packageCard/AdminPackageCard';
import AdminPackageCardSkeleton from '../../components/packageCard/AdminPackageCardSkeleton';
import PackageForm from '../../components/PackageForm/PackageForm';
import DeleteConfirm from '../../components/deleteConformation/DeletePlace';
import SortFilterBar from '../../shared/SortFilterBar/SortFilterBar';
import Skeleton from '../../../shared/Skeleton/Skeleton';

const LIMIT = 4;

export default function AdminPlacePackages() {
  const navigate = useNavigate();

  const { adminPlaceList } = useContext(AdminPlaceContext);
  const { name } = useParams();
  
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [localPlace, setLocalPlace] = useState(null);
  const [loadingPlace, setLoadingPlace] = useState(true);

  const [pack, setPack] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const [deletePackId, setDeletePackId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterValues, setFilterValues] = useState({ sortBy: 'newest' });

  // 1. Resolve Place (standalone fetch for refresh persistence)
  useEffect(() => {
    const resolvePlace = async () => {
      const foundInContext = adminPlaceList.find(p => p.name.toLowerCase() === name.toLowerCase());
      
      if (foundInContext) {
        setLocalPlace(foundInContext);
        setLoadingPlace(false);
      } else {
        try {
          setLoadingPlace(true);
          const res = await fetch(`http://localhost:5000/api/v1/places?search=${name}&limit=1`);
          const data = await res.json();
          if (data.success && data.data.places.length > 0) {
            setLocalPlace(data.data.places[0]);
          }
        } catch (err) {
          console.error("Failed to load place on refresh", err);
        } finally {
          setLoadingPlace(false);
        }
      }
    };
    resolvePlace();
  }, [name, adminPlaceList]);

  // 2. Resolve Packages
  const handlePackages = useCallback(async (pageArg) => {
    if (!localPlace?._id) return;
    try {
      setLoadingPackages(true);
      const { sortBy } = filterValues;
      const targetPage = pageArg || 1; 

      const params = new URLSearchParams({
        page: targetPage,
        limit: LIMIT,
        ...(sortBy && { sortBy })
      });

      const res = await fetch(
        `http://localhost:5000/api/v1/packages/${localPlace._id}?${params.toString()}`
      );

      const data = await res.json();
      if (data.success) {
        setPackages(data.data.packages);
        setTotalPages(data.data.pagination.totalPages);
        setCurrentPage(data.data.pagination.page);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingPackages(false);
    }
  }, [localPlace?._id, filterValues]);

  useEffect(() => {
    if (localPlace?._id) {
      handlePackages(1);
    }
  }, [localPlace, filterValues, handlePackages]);

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
        toast.success("Package deleted successfully");
        const targetPage = packages.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;
        handlePackages(targetPage);
        setDeletePackId(null);
      } else {
        toast.error(data.message || "Failed to delete package");
      }

    } catch (error) {
      toast.error("Error deleting package");
      console.log(error);
    }
  }

  if (loadingPlace) {
    return (
      <div style={{ padding: '20px' }}>
        <Skeleton height="300px" variant="card" />
        <div style={{ marginTop: '20px' }}>
           <Skeleton width="400px" height="40px" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className={style.cover}
        style={{
          backgroundImage: `url(${localPlace?.image})`
        }}
      >
        <div className={style.overlay}></div>

        <div className={style.content}>
          <h1 className={style.head}>{localPlace?.name}</h1>
          <p className={style.cat}>{localPlace?.category}</p>
        </div>
      </div>
      <div className={style.HeadingSec}>
        <div className={style.headerTitle}>
            <button className={style.backBtn} onClick={() => navigate(-1)}>← Back</button>
            <h1>Packages</h1>
        </div>

        <div className={style.headerActions}>
          <SortFilterBar
            values={filterValues}
            onChange={(key, val) => {
              setFilterValues(prev => ({ ...prev, [key]: val }));
              setCurrentPage(1);
            }}
            onReset={() => { setFilterValues({ sortBy: 'newest' }); setCurrentPage(1); }}
            sorts={[
              { label: 'Newest', value: 'newest' },
              { label: 'Oldest', value: 'oldest' },
              { label: 'Price: Low to High', value: 'price_asc' },
              { label: 'Price: High to Low', value: 'price_desc' },
              { label: 'Popularity', value: 'popular' }
            ]}
          />

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
        {loadingPackages ? (
            Array.from({ length: 4 }).map((_, i) => <AdminPackageCardSkeleton key={i} />)
        ) : packages.length === 0 ? (
            <div className={style.empty}>No packages found for this place.</div>
        ) : (
            packages.map((pack) => (
                <AdminPackageCard
                  key={pack._id}
                  pack={pack}
                  onEdit={() => {
                    setPack(pack);
                    setFormOpen(true);
                  }}
                  onDelete={() => setDeletePackId(pack._id)}
                />
            ))
        )}
      </div>

      {/* Server-driven pagination */}
      {totalPages > 1 && (
        <div className={style.pagination}>
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
            place={localPlace}
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
