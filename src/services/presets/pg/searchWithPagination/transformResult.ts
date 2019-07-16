import { compose, last, take } from 'ramda';

import { Serializable, List, list } from '../../../../types';
import { encode, Cursor } from '../../../_common/pagination/cursor';
import { RequestWithCursor, WithSortOrder, WithLimit } from '.';

type ResponseMeta = {
  isLastPage?: boolean;
  lastCursor?: string;
};

const makeCursorFromResponse = <
  Request extends WithSortOrder,
  ResponseTransformed extends Record<string, any>
>(
  request: RequestWithCursor<Request, Cursor>,
  response: ResponseTransformed
): string =>
  encode({
    generated_id: response.data.generated_id,
    sort: request.sort,
  });

const createMeta = <
  Request extends WithSortOrder & WithLimit,
  ResponseRaw,
  ResponseTransformed
>(
  request: RequestWithCursor<Request, Cursor>,
  responsesRaw: ResponseRaw[],
  lastTransformedResponse: ResponseTransformed | undefined
): ResponseMeta => {
  const metaBuilder: ResponseMeta = {};
  if (typeof lastTransformedResponse !== 'undefined') {
    metaBuilder.isLastPage = responsesRaw.length < request.limit;
    metaBuilder.lastCursor = makeCursorFromResponse(
      request,
      lastTransformedResponse
    );
  }
  return metaBuilder;
};

export const transformResults = <
  Request extends WithSortOrder & WithLimit,
  ResponseRaw,
  ResponseTransformed extends Serializable<string, any>
>(
  transformDbResponse: (
    results: ResponseRaw,
    request?: RequestWithCursor<Request, Cursor>
  ) => ResponseTransformed
) => (
  responses: ResponseRaw[],
  request: RequestWithCursor<Request, Cursor>
): List<ResponseTransformed> => {
  const transformedData = compose(
    rs => rs.map(r => transformDbResponse(r, request)),
    take<ResponseRaw>(request.limit - 1)
  )(responses);

  return list(
    transformedData,
    createMeta(request, responses, last(transformedData))
  );
};
