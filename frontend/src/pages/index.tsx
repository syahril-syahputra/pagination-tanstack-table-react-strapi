import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    PaginationState,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { publicApi } from "../servoces/axios";
import { useQuery } from "react-query";
interface IProduct {
    name: string;
    description: string;
    price: number;
    isActive: boolean;
}
interface IData {
    id: number;
    attributes: IProduct;
}
interface IFecthOptions {
    pageIndex: number;
    pageSize: number;
}
const columnHelper = createColumnHelper<IData>();

function HomeScreen() {
    const defaultData = useMemo(() => [], []);

    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const columns = [
        columnHelper.display({
            id: "number",
            header: () => <span>No.</span>,
            cell: (props) => (
                <span className="text-center block">
                    {props.row.index + 1 + pageIndex * pageSize}
                </span>
            ),
        }),
        columnHelper.accessor((row) => row.attributes.name, {
            id: "name",
            cell: (info) => <i>{info.getValue()}</i>,
            header: () => <span>Name</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.attributes.description, {
            id: "desc",
            cell: (info) => <i>{info.getValue()}</i>,
            header: () => <span>Description</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.attributes.price, {
            id: "price",
            cell: (info) => (
                <i className="text-right block">
                    {parseInt(info.getValue() + "").toLocaleString("en")}
                </i>
            ),
            header: () => <span>Price</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.attributes.isActive, {
            id: "isActive",
            cell: (info) => (
                <i>
                    {info.getValue() ? (
                        <span className="text-green-700">Active</span>
                    ) : (
                        <span className="text-red-400">Hidden</span>
                    )}
                </i>
            ),
            header: () => <span>Price</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.display({
            id: "actions",
            cell: (props) => (
                <div className="flex space-x-4 text-center items-center justify-center">
                    <button
                        className="text-blue-700"
                        onClick={() => {
                            alert("Update Data ID : " + props.row.original.id);
                        }}
                    >
                        Update
                    </button>
                    <button
                        className="text-red-700"
                        onClick={() => {
                            alert("Delete Data ID : " + props.row.original.id);
                        }}
                    >
                        Delete
                    </button>
                </div>
            ),
        }),
    ];
    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    );
    const fetchDataOptions: IFecthOptions = {
        pageIndex,
        pageSize,
    };
    const dataQuery = useQuery(
        ["data", fetchDataOptions],
        () => fetchdata(fetchDataOptions),
        { keepPreviousData: true }
    );
    const table = useReactTable({
        data: dataQuery.data?.data ?? defaultData,
        columns,
        pageCount: dataQuery.data?.meta.pagination.pageCount ?? -1,
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination,
        },

        manualPagination: true,
        // getPaginationRowModel: getPaginationRowModel(),
    });
    const fetchdata = async (options: IFecthOptions) => {
        try {
            const respinse = await publicApi.get(
                `/products?pagination[page]=${
                    options.pageIndex + 1
                }&pagination[pageSize]=${options.pageSize}`
            );
            return respinse.data;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container space-y-4 bg-white my-10 rounded-md shadow-lg p-8">
            <h1 className="text-lg font-bold">List Product</h1>
            <table className="w-full bg-gray-400">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="bg-red-200">
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="bg-white p-4 border border-gray-300"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            className="odd:bg-white even:bg-slate-100"
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="text-sm p-4 border border-gray-300"
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex items-center gap-2">
                <button
                    className="border rounded p-1"
                    onClick={() => {
                        table.setPageIndex(0);
                    }}
                    disabled={!table.getCanPreviousPage()}
                >
                    {"<<"}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => {
                        table.previousPage();
                    }}
                    disabled={!table.getCanPreviousPage()}
                >
                    {"<"}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => {
                        table.nextPage();
                    }}
                    disabled={!table.getCanNextPage()}
                >
                    {">"}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {">>"}
                </button>
                <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </strong>
                </span>
                <span className="flex items-center gap-1">
                    | Go to page:
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                            table.setPageIndex(page);
                        }}
                        className="border p-1 rounded w-16"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default HomeScreen;
