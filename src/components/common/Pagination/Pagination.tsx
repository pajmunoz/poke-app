import { Pagination as AntPagination, Flex } from "antd";

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
        <Flex justify="center" align="center" style={{ margin: '20px', width: '100%' }}>

            <AntPagination
                data-testid="pagination"
                current={current}
                total={total}
                pageSize={pageSize || 8}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} Pokemon`
                }
                onChange={onChange}
                onShowSizeChange={onShowSizeChange}
                disabled={disabled}
            />
        </Flex>
    );
}
