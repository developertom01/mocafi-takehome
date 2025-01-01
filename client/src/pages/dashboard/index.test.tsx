import { render, screen } from "@testing-library/react"
import Dashboard from "."


describe('Dashboard', () => {
    it('renders coash dashboard if user type is coach', () => {
        // @ts-ignore
        jest.mock('../../lib/utils/local-storage-manage', () => ({
            LocalStorageManager: {
                getUserType: jest.fn().mockReturnValue('COACH')
            }
        }))
        render(<Dashboard/>)
        const elementText = screen.getByText(/Coach Dashboard/i)
        expect(elementText).toBeInTheDocument();
    })
})