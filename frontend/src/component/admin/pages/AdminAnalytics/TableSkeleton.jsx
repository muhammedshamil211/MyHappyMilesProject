import React from 'react';
import Skeleton from '../../../shared/Skeleton/Skeleton';
import style from './AdminPackageAnalytics.module.css';

const TableSkeleton = ({ rows = 5, cols = 6 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <td key={colIndex}>
              <Skeleton width="80%" height="20px" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;
