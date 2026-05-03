import React from "react";
import { ADMIN_MANAGE_TABLE_STRINGS } from "@i18n/ui/admin/admin-manage-table";
import "./AdminManageTable.scss";

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

    // Decoupled row rendering logic to improve maintainability
    const renderRow = (item: T) => (
        <React.Fragment key={item.id}>
            {renderItem(item)}
        </React.Fragment>
    );

    const renderHeader = (header: string, index: number) => (
        <span key={index}>{header}</span>
    )
    
    return (
        <div className={`admin-table admin-table--${variant} ${className}`}>
            <div className="admin-table__header-row">
                {headers.map(renderHeader)}
            </div>

            <div className="admin-table__content">
                {items.length > 0 ? (
                    items.map(renderRow)
                ) : (
                    <div className="admin-table__empty">{ADMIN_MANAGE_TABLE_STRINGS.NO_DATA}</div>
                )}
            </div>
        </div>
    );
};