import React from 'react';

const EmptyState = ({ message, icon = 'fas fa-box-open', columns = "100%" }) => {
  return (
    <tr>
      <td colSpan={columns} className="text-center py-5 border-0">
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '20vh' }}>
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center mb-4" 
            style={{ 
              width: '80px', 
              height: '80px', 
              backgroundColor: 'rgba(255,255,255,0.03)',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
            }}
          >
            <i className={`${icon}`} style={{ fontSize: '2.5rem', color: 'rgba(255,255,255,0.15)' }}></i>
          </div>
          <h5 className="text-muted font-weight-bold m-0" style={{ letterSpacing: '1px' }}>{message}</h5>
        </div>
      </td>
    </tr>
  );
};

export default EmptyState;
