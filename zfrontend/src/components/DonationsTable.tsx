"use client";

import { TransactionWithDonation } from "@/models/donation";
import { getFormattedDate } from "@/utils/date";
import {
  Button,
  NextUIProvider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

const columns = [
  { key: "createdAtUtc", label: "Date" },
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "amount", label: "Amount" },
];

export default function DonationsTable() {
  const [donations, setDonations] = useState<TransactionWithDonation[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const rowsPerPage = 10;

  useEffect(() => {
    TransactionWithDonation.getAll(page, rowsPerPage)
      .then((donations) => {
        setDonations(donations.data);
        setHasNextPage(donations.hasNextPage);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [page]);

  return (
    <NextUIProvider>
      <Table
        aria-label="donations table"
        bottomContent={
          <div className="flex space justify-between">
            <Button
              color="primary"
              onPress={() => setPage(page - 1)}
              isDisabled={page === 1}
            >
              Previous Page
            </Button>
            <Button
              color="primary"
              onPress={() => setPage(page + 1)}
              isDisabled={!hasNextPage}
            >
              Next Page
            </Button>
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={donations} emptyContent={"No rows to display."}>
          {(item) => (
            <TableRow key={item.id} className="text-black">
              <TableCell>
                {getFormattedDate(item.donation.createdAtUtc)}
              </TableCell>
              <TableCell>{item.donation.firstName}</TableCell>
              <TableCell>{item.donation.lastName}</TableCell>
              <TableCell>
                {(item.donation.amount - item.refundedAmount).toLocaleString()}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </NextUIProvider>
  );
}
