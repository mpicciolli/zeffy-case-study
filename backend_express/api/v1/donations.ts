import { Router, Request, Response } from 'express';
import { getDonations } from './repositories/donations';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    const donations = getDonations();

    const page = req.query.page as string;
    const pageSize = req.query.pageSize as string;

    const parsedPage = parseInt(page, 10) || 1;
    const parsedPageSize = parseInt(pageSize, 10) || 10;

    let startIndex = getStartIndex(parsedPage, parsedPageSize);
    const paginatedDonations = donations.slice(startIndex, getEndIndex(startIndex, parsedPageSize));

    const nextPagesStartIndex = getStartIndex(parsedPage + 1, parsedPageSize);
    const nextPageDonations = donations.slice(nextPagesStartIndex, getEndIndex(nextPagesStartIndex, parsedPageSize));

    res.json({
        data: paginatedDonations,
        hasNextPage: nextPageDonations.length > 0
    });
});

function getStartIndex(page: number, size: number): number {
    return (page - 1) * size;
}

function getEndIndex(startIndex: number, size: number): number {
    return startIndex + size
}

export default router;
