import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Input,
  Button,
} from '@chakra-ui/react';
import { IAdminTableProps } from '@/types';
import { memo } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { deleteProduct, updateProduct } from '@/actions/clientActions';

// Определяем функциональный компонент
const AdminTableComponent: React.FC<IAdminTableProps> = ({
  caption,
  columns,
  data,
  isLoading,
  deleteFlag,
  updateFlag,
}) => {
  const dispatch = useAppDispatch();

  const handleInputChange = (productId: number, key: string, value: string) => {
    const updates = { [key]: value };

    console.log('updates ', updates);

    dispatch(updateProduct({ productId, updates, updateFlag }));
  };

  const handleDelete = (id: number) => {
    dispatch(deleteProduct({ productId: id, deleteFlag }));
  };

  return (
    <TableContainer>
      <Table variant="striped" size="sm" colorScheme="teal">
        <TableCaption>{caption}</TableCaption>
        <Thead>
          <Tr>
            {columns.map((col) => (
              <Th key={col.key}>{col.label}</Th>
            ))}
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {!isLoading && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {columns.map((col) => (
                  <Td key={col.key}>
                    {col.key === 'createdAt' || col.key === 'updatedAt' ? (
                      row[col.key] ? (
                        new Date(row[col.key]).toLocaleString()
                      ) : (
                        'N/A'
                      )
                    ) : (
                      <Input
                        value={row[col.key]}
                        onChange={(e) =>
                          handleInputChange(row.id, col.key, e.target.value)
                        }
                        size="sm"
                      />
                    )}
                  </Td>
                ))}
                <Td>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDelete(row.id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={columns.length + 1} textAlign="center">
                No data available
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

// Оборачиваем компонент в memo и задаем displayName
const AdminTable = memo(AdminTableComponent);
AdminTable.displayName = 'AdminTable';

export default AdminTable;
