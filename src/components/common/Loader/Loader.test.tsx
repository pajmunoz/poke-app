import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Loader from './Loader';

describe('Loader', () => {
    it('should render the loader component', () => {
        render(<Loader />);

    });
});
