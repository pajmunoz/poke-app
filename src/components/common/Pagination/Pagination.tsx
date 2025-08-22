import { Pagination as AntPagination } from "antd";

interface PaginationProps {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number) => void;
    onShowSizeChange: (current: number, size: number) => void;
    disabled?: boolean;
}

export default function Pagination({
    current,
    total,
    pageSize,
    onChange,
    onShowSizeChange,
    disabled = false
}: PaginationProps) {
    return (
        <AntPagination
            data-testid="pagination"
            current={current}
            total={total}
            pageSize={pageSize}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => 
                `${range[0]}-${range[1]} of ${total} Pokemon`
            }
            onChange={onChange}
            onShowSizeChange={onShowSizeChange}
            disabled={disabled}
        />
    );
}
