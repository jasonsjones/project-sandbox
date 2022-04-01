import { useMutation } from 'react-query';
import { useAuthContext } from '../context/AuthContext';
import { GraphQLResponse, makeGraphQLFileUpload } from '../dataservice';

interface FileUploadOptions {
    onSuccess?: (response: GraphQLResponse) => void;
    onError?: (error: Error) => void;
}

interface UploadPayload {
    query: string;
    variables?: object;
    token?: string;
    file?: File;
}

export default function useFileUpload(fileUploadOptions: FileUploadOptions) {
    const { token } = useAuthContext();

    const mutation = useMutation(makeGraphQLFileUpload, {
        onSuccess: fileUploadOptions.onSuccess,
        onError: fileUploadOptions.onError
    });

    const fileUpload = (payload: UploadPayload) => {
        return mutation.mutate({ ...payload, token });
    };

    return {
        ...mutation,
        fileUpload
    };
}
