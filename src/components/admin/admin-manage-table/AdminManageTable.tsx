import React from "react";
import "./AdminManageTable.scss";

// generikus típus, kódduplikáció elkerülése
interface AdminManageTableProps<T> {
    items: T[];
    headers: string[];
    renderItem: (item: T) => React.ReactNode;
    variant: "songs" | "users";
    className?: string;
}

export const AdminManageTable = <T extends { id: string | number }> ({
    items,
    headers,
    renderItem,
    variant,
    className = ""
}: AdminManageTableProps<T>) => {

    // a renderelési logika különszervezése, 
    // hogy könnyebb legyen a hibakeresés és bővítés
    const renderRow = (item: T) => (
        <React.Fragment key={item.id}>
            {renderItem(item)}
        </React.Fragment>
    );

    const renderHeader = (header: string, index: number) => (
        <span key={index}>{header}</span>
    )
    
    return (
        // dinamikus osztálynevek
        <div className={`admin-table admin-table--${variant} ${className}`}>
            <div className="admin-table__header-row">
                {headers.map(renderHeader)}
            </div>

            <div className="admin-table__content">
                {items.length > 0 ? (
                    items.map(renderRow)
                ) : (
                    <div className="admin-table__empty">No data</div>
                )}
            </div>
        </div>
    );
};